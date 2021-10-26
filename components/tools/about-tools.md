# Tools

In this app, tools work like states in a finite state machine:

- there are several tools that all implement the same interface;
- one tool is always "selected"; and
- there can only ever be one tool selected at a time.

## Events

The `useTool` hook will forward events to the selected tool, which may deal with the event in different ways.

## Current Path

Along with the events, the hook will also forward the `currentPath`, an SVG path that the tool may modify while a user is drawing a new shape; i.e. before the shape is committed to the document.

## Changing Tools

You can change tools by using the `onToolSelect` method. When you select a tool, the previously selected tool will run its `onDeselect` method, and the newly selected tool will run its `onSelect` method.
