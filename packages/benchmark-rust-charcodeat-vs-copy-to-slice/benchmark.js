import Benchmark from 'benchmark';
import {
  malloc,
  free,
  iter_js_str,
  copy_and_iter_slice,
  __wasm as wasm,
} from './dist/index.js';
let HEAPU16;
const long_string = 'a'.repeat(100000000); // 1 million characters
const stringToUTF16 = (str) => {
  const len = str.length;
  const ptr = malloc(len << 1);
  if (!HEAPU16 || HEAPU16.byteLength === 0) {
    HEAPU16 = new Uint16Array(wasm.memory.buffer);
  }
  for (let i = 0; i < len; i++) {
    HEAPU16[(ptr >> 1) + i] = str.charCodeAt(i);
  }
  return { ptr, len };
};

const traverseInRust = (str) => {
  return iter_js_str(str);
};
const copyInJs = (str) => {
  const { ptr, len } = stringToUTF16(str);
  const sum = copy_and_iter_slice(ptr, len);
  free(ptr, len << 1);
  return sum;
};

const suite = new Benchmark.Suite();

suite
  .add('traverseInRust', () => {
    const result = traverseInRust(long_string);
    return result;
  })
  .add('copyInJs', () => {
    const result = copyInJs(long_string);
    return result;
  })
  .on('complete', function() {
    this.forEach((benchmark) => {
      const totalTimeMs = benchmark.times.elapsed * 1000;
      const perCharTimeMs = totalTimeMs / long_string.length;
      const result = benchmark.fn(); // Execute the function to get the return value
      console.log(`${benchmark.name}:`);
      console.log(`  Total time: ${totalTimeMs.toFixed(3)} ms`);
      console.log(`  Per char time: ${perCharTimeMs.toFixed(6)} ms`);
      console.log(`  Return value: ${result}`);
    });
  })
  .run();
