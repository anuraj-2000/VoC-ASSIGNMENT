# Demo of VoC Intelligence Agent

## Running the Agent

During execution the agent performs the following tasks automatically:

Scrapes product reviews using Playwright
Classifies sentiment and themes using the LLM
Stores processed reviews in a SQLite database
Detects duplicate reviews using a review hash
Generates customer insight reports

Command:

node agent/agent.js

Output:

Starting VoC Intelligence Agent...
Reviews scraped: 21
Duplicate reviews skipped: 0
Review stored
Global report generated
Weekly delta report generated

## Generated Reports

reports/global_report.md
reports/weekly_report.md

These reports summarize recurring feedback and action items.

## Conversational Query Example

The system also supports querying the review database using natural language.

Command:

node agent/queryAgent.js "Which product has better comfort?"

Output:

Product X shows stronger comfort feedback based on customer reviews.

## Scheduling

The agent can be scheduled to run weekly using:

scheduler/weeklyRun.js

This runs the agent every Monday at 2:00 AM to ingest new reviews and generate updated reports.


## Summary

This demo shows how the VoC Intelligence Agent:

Collects customer reviews automatically
Extracts structured insights using an LLM
Maintains a local review database
Generates actionable reports
Answers analytical questions using real customer feedback

## For screenshots refer the screenshots folder