# Lusynth
Lusynth is a structural editor and inline evaluator for a purely functional dialect of Lisp.

The code being edited is represented as an AST and modified based on keystrokes, always preserving a syntactically valid structure. As the code changes, it is re-evaluated and each reduction step is shown or summarized.

## Persistence
All keyboard input is appended to a file and can be replayed to restore the current or any previous application state.

## Roadmap
After the basic implementation is complete, future work will focus on better editing controls and reduction summaries.
