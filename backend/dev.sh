#!/bin/bash
gradle build -x test -x checkstyleMain -x checkstyleTest -x jar -x distTar -x distZip --continuous &
gradle bootRun --no-build-cache