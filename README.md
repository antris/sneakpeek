# sneakpeek

Hides header when scrolling down. Shows header when scrolling up. No external
dependencies.

It shows/hides the header by toggling a `header__hidden` class. Style it however
you want.

## Install

Install from npm:

    npm install sneakpeek

## Usage

With browserify:

    sneakpeek = require('sneakpeek')
    sneakpeek(document.getElementById('header'))
