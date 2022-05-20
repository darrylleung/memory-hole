# Memory Hole

<img src="misc/preview.gif">

Live site: https://memory-hole.herokuapp.com

## Overview

The Memory Hole 🕳 is a public image board platform that allows users to upload and comment. 

## Image Grid
- Photographs are arranged using `Grid`, with new images appearing at the top. 
- Clicking on an image thumbnail brings up the Image Focus component, where users can see a larger version of the image as well as the image poster's name, the title and description of the image, and a comment section.
- Scrolling down the page loads more pictures until there are no more images.

## Uploader
- A button on the bottom-left of the app opens the Uploader component.
- Users can select a file or choose to drag and drop an image into the component.
- Once an image has been selected, a panel slides up to reveal the inputs for the image data (name, title, and description).
- Upon completion of upload, the component disappears into the void (very proud of this bit of CSS!)

## Tech Stack

JavaScript, Vue.js, node.js, Express, PostgreSQL, Heroku, AWS