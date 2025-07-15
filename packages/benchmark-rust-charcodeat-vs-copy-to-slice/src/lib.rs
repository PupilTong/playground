use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn malloc(size: usize) -> *mut u8 {
    // Allocate memory on the heap
    let layout = std::alloc::Layout::from_size_align(size, 16).unwrap();
    unsafe { std::alloc::alloc(layout) }
}

#[wasm_bindgen]
pub fn free(ptr: *mut u8, size: usize) {
    // Free the allocated memory
    // We need to reconstruct the Layout that was used for allocation.
    // Assuming align is 1 as used in malloc.
    let layout = std::alloc::Layout::from_size_align(size, 16).unwrap();
    unsafe { std::alloc::dealloc(ptr, layout) }
}

#[wasm_bindgen]
pub fn copy_and_iter_slice(ptr: *const u16, len: usize) -> u16 {
    // Create a slice from the raw pointer
    unsafe {
        let mut sum: u16 = 0;
        let slice = core::slice::from_raw_parts(ptr, len);
        for &item in slice.iter() {
            // Simulate some operation on each item
            sum += item;
        }
        return sum;
    };
}

#[wasm_bindgen]
pub fn iter_js_str(js_str: js_sys::JsString) -> u16 {
    let mut sum: u16 = 0;
    for char in js_str.iter() {
        sum += char;
    }
    return sum;
}
