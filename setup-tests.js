const mockAsyncFn = jest.fn(() => Promise.resolve());

// react-native-cookies currently throws an "add files to XCode project" error when running
// tests. We'll need to investigate this or add alternate functionality to add session
// testing in the future. -BW
jest.mock('react-native-cookies', () => {
  return {
    set: mockAsyncFn,
    setFromResponse: mockAsyncFn,
    getFromResponse: mockAsyncFn,
    get: mockAsyncFn,
    getAll: mockAsyncFn,
    clearAll: mockAsyncFn,
    clearByName: mockAsyncFn,
  };
});
