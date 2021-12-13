#!/bin/sh
gradle build -x Test -x checkstyleMain -x checkstyleTest -x jar -x distTar -x distZip --continuous &
gradle bootRun --no-build-cache
