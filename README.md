# Interactive Fictions

> An Infocom-style text adventure game engine.

This project is an attempt to create an Infocom-style text adventure game engine using JavaScript.

## Game Sequence from Zork

- [ ] Initialize game with GO
  - [ ] Set special global variables (WINNER, PLAYER, HERE, LIT, SCORE, SCORE-MAX, MOVES, PRSA, PRSO, PRSI)
  - [ ] Queue interrupts based on start of game
  - [ ] Display opening text/title screen
  - [ ] Call V-LOOK to describe current location
  - [ ] Call the MAIN-LOOP
- [ ] Heartbeat of game with MAIN-LOOP
- [ ] Understand the user with PARSER
- [ ] Call the action with PERFORM
- [ ] Call CLOCKER

## TODO: An incomplete and growing list

- [x] Define Item class
- [x] Create sample Item
- [x] Define Room class
- [x] Create sample Room
- [ ] Add parser scaffolding
- [ ] Add PERFORM command (see gmain.zil)
  - [ ] Handle parser errors
  - [ ] Call PRSI action
  - [ ] Call PRSO action
  - [ ] Call Verb action
- [ ] Add automatic translation of Items to parser tokens
- [ ] Add status bar: HERE, SCORE/MAX, MOVES
- [ ] Add debug bar: https://bit.ly/3nxfP2G
- [ ] Add TEST verb: https://bit.ly/3nxfP2G
- [ ] Add TELL routine (output to screen)
- [ ] Add JIGS-UP routine
- [ ] Add LOOK (L) command
  - [ ] Describe the room
  - [ ] Describe items in the room
  - [ ] Describe the exits
- [ ] Add Brief/Verbose modes
  - [ ] Handle BRIEF, SUPERBRIEF, VERBOSE commands
- [ ] Translate useful SYNTAX entries from Zork
- [ ] Translate useful VERB entries from Zork
- [ ] Translate useful GLOBAL entries from Zork
- [ ] Add basic commands: DIAGNOSE, SCORE
- [ ] Handle moving between rooms
  - [ ] Add GOTO and DO-WALK
  - [ ] Check if there is an exit in this direction
  - [ ] Set HERE to new room
  - [ ] Set TOUCHED bit in new room
  - [ ] Call Room description
- [ ] Advanced parser
  - [ ] Take objects if needed
  - [ ] Syntax tokens: HAVE, TAKE, MANY, EVERYWHERE, ADJACENT, HELD, CARRIED, ON-GROUND, IN-ROOM
  - [ ] Switch syntaxes
  - [ ] Fail for unknown tokens
  - [ ] Add Get-What-I-Mean, Find
  - [ ] Multiple objects: separate by AND or comma.
  - [ ] Handle IT in commands
  - [ ] Handle ALL in commands (every visible object not inside a container)
  - [ ] Sequential commands: separate by THEN or period.
    - [ ] Flush input if sequential commands fail
- [ ] Advanced PERFORM
  - [ ] Pre: Call WINNER action
  - [ ] Pre: Call Room M-BEG action
  - [ ] Pre: Call pre-verb action
  - [ ] Post: Call Room M-END action
- [ ] Handle taking objects
  - [ ] Add INVENTORY (I) command
- [ ] Handle containers
  - [ ] Open/Close container
  - [ ] Surfaces
- [ ] Handle lighting
  - [ ] Objects that emit light
  - [ ] Rooms that are lit
  - [ ] Affect room descriptions (check LIT in M-BEG?)
- [ ] Handle doors
  - [ ] Handle locked/unlocked
  - [ ] Handle open/closed
- [ ] Handle elevation changes
  - [ ] Add stairs
  - [ ] Add elevator
- [ ] Add Event System
  - [ ] Add CLOCKER
  - [ ] Add Interrupt routines
  - [ ] Add Queing
  - [ ] Add WAIT command
- [ ] Add Actors
  - [ ] Handle speaking to actors
  - [ ] Handle giving directions to actors
- [ ] Add SAVE/RESTORE
  - [ ] Add AUTOSAVE
  - [ ] Add UNDO
  - [ ] Add QUIT
  - [ ] Add RESTART
