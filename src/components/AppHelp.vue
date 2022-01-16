<template>
  <section class="app-help">
    <div class="prose">
      <h2>How to Play:</h2>
      <p>
        With Interactive Fiction, you type your commands in plain English each
        time you see the prompt (>). Most of the sentences that The STORIES will
        understand are imperative sentences. See the examples below. When you
        have finished typing your input, press the RETURN (or ENTER) key. The
        STORY will then respond, telling you whether your request is possible at
        this point in the story, and what happened as a result.
      </p>
      <p>
        To move around, just type the direction you want to go. Directions can
        be abbreviated: NORTH to N, SOUTH to S, EAST to E, WEST to W, NORTHEAST
        to NE, NORTHWEST to NW, SOUTHEAST to SE, SOUTHWEST to SW, UP to U, and
        DOWN to D. IN and OUT will also work in certain places.
      </p>
      <p>
        There are many different kinds of sentences used in interactive fiction
        games. Here are some examples:
      </p>
      <ul>
        <li>WALK TO THE NORTH</li>
        <li>WEST</li>
        <li>NE</li>
        <li>DOWN</li>
        <li>TAKE THE BIRDCAGE</li>
        <li>OPEN THE PANEL</li>
        <li>READ ABOUT DIMWIT FLATHEAD</li>
        <li>HIT THE LAMP</li>
        <li>LIE DOWN IN THE PINK SOFA</li>
        <li>EXAMINE THE SHINY COIN</li>
        <li>PUT THE RUSTY KEY IN THE CARDBOARD BOX</li>
        <li>SHOW MY BOW TIE TO THE BOUNCER</li>
        <li>HIT THE CRAWLING CRAB WITH THE GIANT NUTCRACKER</li>
        <li>ASK THE COWARDLY KING ABOUT THE CROWN JEWELS</li>
      </ul>
      <p>
        You can use multiple objects with certain verbs if you separate them by
        the word AND or by a comma. Some examples:
      </p>
      <ul>
        <li>TAKE THE BOOK AND THE FROG</li>
        <li>DROP THE JAR OF PEANUT BUTTER, THE SPOON, AND THE LEMMING FOOD</li>
        <li>PUT THE EGG AND THE PENCIL IN THE CABINET</li>
      </ul>
      <p>
        You can include several inputs on one line if you separate them by the
        word THEN or by a period. Each input will handled in order, as though
        you had typed them individually at separate prompts. For example, you
        could type all of the following at once, before pressing the RETURN (or
        ENTER) key:
      </p>
      <ul>
        <li>TURN ON THE LIGHT. KICK THE LAMP.</li>
      </ul>
      <p>
        If The STORY doesn't understand one of the sentences on your input line,
        or if an unusual event occurs, it will ignore the rest of your input
        line. The words IT and ALL can be very useful. For example:
      </p>
      <ul>
        <li>EXAMINE THE APPLE. TAKE IT. EAT IT</li>
        <li>CLOSE THE HEAVY METAL DOOR. LOCK IT</li>
        <li>PICK UP THE GREEN Boor. SMELL IT. PUT IT ON.</li>
        <li>TAKE ALL</li>
        <li>TAKE ALL THE TOOLS</li>
        <li>DROP ALL THE TOOLS EXCEPT THE WRENCH AND THE MINIATURE HAMMER</li>
        <li>TAKE ALL FROM THE CARTON</li>
        <li>GIVE ALL BUT THE RUBY SLIPPERS TO THE WICKED WITCH</li>
      </ul>
      <p>
        The word ALL refers to every visible object except those inside
        something else. If there were an apple on the ground and an orange
        inside a cabinet, TAKE ALL would take the apple but not the orange.
      </p>
      <p>
        When you meet intelligent creatures, you can talk to them by typing
        their name, then a comma, then whatever you want to say to them. Here
        are some examples:
      </p>
      <ul>
        <li>SALESMAN, HELLO</li>
        <li>HORSE, WHERE IS YOUR SADDLE?</li>
        <li>BOY, RUN HOME THEN CALL THE POLICE</li>
        <li>MIGHTY WIZARD, TAKE THIS POISONED APPLE. EAT IT</li>
      </ul>
      <p>
        Notice that in the last two examples, you are giving the character more
        than one command on the same input line. Keep in mind, however, that
        many creatures don't care for idle chatter; your actions will speak
        louder than your words.
      </p>
      <h3>Basic Commands</h3>
      <p>
        BRIEF - This command fully describe a location only the first time you
        enter it. On subsequent visits, only the name of the location and any
        objects present will be described. The adventures will begin in BRIEF
        mode, and remain in BRIEF mode unless you use the VERBOSE or SUPERBRIEF
        commands SUPERBRIEF displays only the name of a place you have entered,
        even if you have never been there before. In this mode, not even mention
        objects are described. Of course, you can always get a full description
        of your location and the items there by typing LOOK. In SUPERBRIEF mode,
        the blank line between turns will be eliminated. This mode is meant for
        players who are already familiar with the geography. The VERBOSE command
        gives a complete description of each location, and the objects in it,
        every time you enter a location, even if you've been there before.
      </p>
      <p>DIAGNOSE - This will give you a report of your physical condition.</p>
      <p>
        INVENTORY - This will give you a list what you are carrying and wearing.
        You can abbreviate INVENTORY to I.
      </p>
      <p>
        LOOK - This will give you a full description of your location. You can
        abbreviate LOOK to L.
      </p>
      <p>
        EXAMINE object - This will give you a description of the object. It is
        important to look at all objects as there may be clues to an object's
        use in its description. You can abbreviate EXAMINE to X.
      </p>
      <p>
        QUIT - This lets you stop. If you want to save your position before
        quitting, you must use the SAVE command.
      </p>
      <p>RESTORE - This restores a previously saved position.</p>
      <p>
        RESTART - This stops the story and starts it over from the beginning.
      </p>
      <p>
        SAVE - This saves a "snapshot" of your current position. You can return
        to a saved position in the future using the RESTORE command.
      </p>
      <p>
        WAIT - Allows time to pass; effectively you do nothing while the game
        continues. You can abbreviate WAIT to Z.
      </p>
      <p>
        SCORE - Displays your current score and rank. Typing FULL SCORE will
        show you what you have done to earn your points.
      </p>
      <p>
        (Copied from the
        <a
          href="http://mirrors.ibiblio.org/interactive-fiction/infocom/demos/ztuu.pdf"
          >Zork instruction manual</a
        >.)
      </p>
      <h2>Credits</h2>
      <p>
        Created by <a href="https://twitter.com/spaceninja/">Scott Vandehey</a>.
        This JavaScript-power text adventure engine is strongly modelled on
        classic
        <a href="https://ifwiki.org/index.php/Infocom-type_parser">Infocom</a>
        games like <a href="https://github.com/historicalsource/zork1">Zork</a>.
        This would not have been possible without the
        <a
          href="https://archive.org/details/Learning_ZIL_Steven_Eric_Meretzky_1995"
          >Learning ZIL</a
        >
        manual, and the encouragement of
        <a href="https://twitter.com/vosechu">Chuck Lauer Vose</a>.
      </p>
    </div>
  </section>
</template>
