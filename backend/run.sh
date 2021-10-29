#!/bin/bash
gradle --stop
gradle build --continuous \
  -x Test \
  -x checkstyleMain \
  -x checkstyleTest \
  -x jar \
  &
gradle bootRun --no-build-cache