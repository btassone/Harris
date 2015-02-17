'use strict';

angular.module('harris.version', [
  'harris.version.interpolate-filter',
  'harris.version.version-directive'
])

.value('version', '0.1');
