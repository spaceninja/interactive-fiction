# Interactive Fictions

> An Infocom-style text adventure game engine.

This project is an attempt to create an Infocom-style text adventure game engine using JavaScript.

## Game Sequence from Zork

- [ ] Print game title/copyright/version/etc
- [ ] Initialize game with GO
  - [ ] Set special global variables (WINNER, PLAYER, HERE, LIT, SCORE, SCORE-MAX, MOVES, PRSA, PRSO, PRSI)
  - [ ] Queue interrupts based on start of game
  - [ ] Display opening text/title screen
  - [ ] Call V-LOOK to describe current location
  - [ ] Call the MAIN-LOOP
- [x] Heartbeat of game with MAIN-LOOP
- [x] Understand the user with PARSER
- [x] Call the action with PERFORM
- [ ] Call CLOCKER

## TODO: An incomplete and growing list

- [x] Define Item class
- [x] Create sample Item
- [x] Define Room class
- [x] Create sample Room
- [x] Define Verb class
- [x] Create sample Verbs
- [x] Add parser scaffolding
- [x] Add automatic translation of Items to parser tokens
- [x] Add automatic translation of Verbs to parser tokens
- [x] Add status bar: HERE, SCORE/MAX, MOVES
- [x] Add debug bar
- [x] Add help page
- [x] Add TELL routine (output to screen)
- [x] Handle Player Input
  - [x] Pass through parser, handle errors
  - [x] Set PRSA, PRSO, PRSI globals
  - [x] If no errors, pass to PERFORM
  - [x] Fail for unknown tokens
- [x] Add PERFORM command (see gmain.zil)
  - [x] Call PRSI action
  - [x] Call PRSO action
  - [x] Call Verb action
- [x] Add Score verb
- [x] Add SCORE command
- [x] Add TEST command
- [x] Add EXAMINE command
  - [x] Default verb functionality
  - [x] Add example of item with examine action
  - [x] Add example of item with text to read
- [x] Add LOOK (L) command
  - [x] Describe the room
  - [x] Describe items in the room
- [x] Add real objects for pseudo-objects
  - [x] Remove pseudo property
- [x] Add GO routine from 1dungeon
  - [x] Set intitial game state for critical variables
- [x] Translate useful VERB entries from Zork
  - [x] Add LOOK-BEHIND/LOOK-ON/LOOK-UNDER commands
  - [x] Add MOVE command
  - [x] Add READ command
  - [x] Add SMELL command
  - [x] Add ATTACK command
- [ ] Handle moving between rooms
  - [ ] Add GOTO and DO-WALK
  - [ ] Check if there is an exit in this direction
  - [ ] Set HERE to new room
  - [ ] Set TOUCHED bit in new room
  - [ ] Call Room description
  - [ ] Add to score?
- [ ] Handle taking items
  - [ ] Add ME object?
  - [ ] Add ADVENTURER object
  - [ ] Add ACCESSIBLE? check from gparser
  - [ ] Add SEE-INSIDE? check from gverbs
  - [ ] Add OPENABLE? check from gmacros
  - [ ] Add INVENTORY (I) command
  - [ ] Add GET/TAKE/DROP/PUT/PUT-ON/PUT-UNDER/PUT-BEHIND commands
  - [ ] "The object that you mentioned isn't here" response
  - [ ] "There's nothing here you can take" response
- [ ] Handle containers
  - [ ] Open/Close container
  - [ ] Surfaces
  - [ ] Add LOOK-INSIDE command
- [ ] Handle doors
  - [ ] Handle locked/unlocked
  - [ ] Handle open/closed
- [ ] Handle elevation changes
  - [ ] Add stairs (? what's to handle?)
  - [ ] Add elevator (? how does an elevator work?)
  - [ ] Add rope
  - [ ] Add CLIMB-DOWN/UP commands
- [ ] Handle lighting
  - [ ] Add candles?
  - [ ] Add Lantern queue item
  - [ ] Add LIT? check from gparser
  - [ ] Add REMOVE-CAREFULLY method (handles lighting changes)
  - [ ] Items that emit light
  - [ ] Rooms that are lit
  - [ ] Affect room descriptions (check LIT in M-BEG?)
  - [ ] "It's too dark to see"/"It's not clear what you're referring to" responses
- [ ] Add Brief/Verbose modes
  - [ ] Handle BRIEF, SUPERBRIEF, VERBOSE commands
- [ ] Advanced parser
  - [ ] Syntax tokens:
    - HAVE, TAKE, MANY, EVERYWHERE, ADJACENT, HELD, CARRIED, ON-GROUND, IN-ROOM
  - [ ] Switch syntaxes
  - [ ] Add Get-What-I-Mean, Find
  - [ ] Multiple items: separate by AND or comma.
  - [ ] Handle IT in commands
  - [ ] Handle ALL in commands (every visible item not inside a container)
  - [ ] Sequential commands: separate by THEN or period.
    - [ ] Flush input if sequential commands fail
- [ ] Advanced PERFORM
  - [ ] Pre: Call WINNER action
  - [ ] Pre: Call Room M-BEG action
  - [ ] Pre: Call pre-verb action
  - [ ] Post: Call Room M-END action
  - [ ] Add HELD? check from gverbs
  - [ ] "I don't see what you're referring to" response
- [ ] Add Event System
  - [ ] Add CLOCKER
  - [ ] Add Interrupt routines
  - [ ] Add Queing
  - [ ] Add WAIT command
- [ ] Add Actors
  - [ ] Handle speaking to actors V-SAY
  - [ ] Handle giving directions to actors
  - [ ] Add GIVE command
- [ ] Add Fighting
  - [ ] Add ATTACK/STAB/STRIKE/THROW commands
  - [ ] Add DIAGNOSE verb and command
  - [ ] Add JIGS-UP routine
- [ ] Add Vehicles
  - [ ] Updates to describe routines
  - [ ] Add BOARD/CLIMB-ON/DISEMBARK/EXIT commands
- [ ] Add SAVE/RESTORE
  - [ ] Add AUTOSAVE
  - [ ] Add UNDO
  - [ ] Add QUIT
  - [ ] Add FINISH
  - [ ] Add RESTART
