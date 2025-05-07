import { TextEncoder, TextDecoder } from "node:util";
import { enableFetchMocks } from "jest-fetch-mock";
// https://github.com/jsdom/jsdom/issues/2524
// https://github.com/remix-run/react-router/issues/12363
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// https://stackoverflow.com/questions/74497916
enableFetchMocks();
