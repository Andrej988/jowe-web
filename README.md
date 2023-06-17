[![CI](https://github.com/Andrej988/jowe-web/actions/workflows/ci_main.yml/badge.svg)](https://github.com/Andrej988/jowe-web/actions/workflows/ci_main.yml)
[![CI](https://github.com/Andrej988/jowe-web/actions/workflows/release_github.yml/badge.svg)](https://github.com/Andrej988/jowe-web/actions/workflows/release_github.yml)
[![CI](https://github.com/Andrej988/jowe-web/actions/workflows/deploy_terraform.yml/badge.svg)](https://github.com/Andrej988/jowe-web/actions/workflows/deploy_terraform.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# JoWe (Journal for Wellness) Web

Frontend for JoWe (Journal for Wellness) application. <br />
For backend see: https://github.com/Andrej988/jowe-api

## About
JoWe Web is a UI (user interface) for JoWe application, it is build with Typescript, React and CoreUI library (with some additional custom modifications).
Application is leveraging terraform (IaC) for deployment on AWS as a static website using Cloudfront and S3.

## Background
JoWe application started as a small proof-of-concept project to learn more about AWS serverless and Terraform. As I poses a semi-smart bathroom scale which is able to obtain also other indicators besides weight, I decided to build a small application to track these measurements and progress over time.
