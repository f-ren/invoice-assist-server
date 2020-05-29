const { expect } = require('chai');
const supertest = require('supertest');

process.env.TEST_DB_URL = process.env.TEST_DB_URL;

global.expect = expect;
global.supertest = supertest;
