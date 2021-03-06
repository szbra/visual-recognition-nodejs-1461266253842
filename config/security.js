/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// security.js
var rateLimit  = require('express-rate-limit'),
  csrf         = require('csurf'),
  cookieParser = require('cookie-parser'),
  helmet       = require('helmet');

module.exports = function (app) {
  app.enable('trust proxy');

  // 1. helmet with defaults
  app.use(helmet({ cacheControl: false }));

  // 2. rate-limit to /api/
  app.use('/api/', rateLimit({
    windowMs: 60 * 1000, // seconds
    delayMs: 0,
    max: 6
  }));

  // 3. setup cookies
  var secret = Math.random().toString(36).substring(7);
  app.use(cookieParser(secret));

  // 4. csrf
  var csrfProtection = csrf({ cookie: true });
  app.get('/*', csrfProtection, function(req, res, next) {
    req._csrfToken = req.csrfToken();
    next();
  });
};
