# Gulp/Webpack Boilerplate
This is a starting place for projects using Gulp and webpack.

## Technologies/Frameworks
- [webpack](https://webpack.js.org/)
- Gulp 4
- Babel 7

## Initial Setup
Clone the repository and run `npm install` in the terminal from the directory to download all dependencies.

## Development

### CSS Guidelines
Mappy Breakpoints is included in this build to manage media query breakpoints. It is included via NPM and imported into `/_src/scss/styles.scss`.

### JS Guidelines
webpack is being used to bundle all JavaScript modules. You can import JS dependencies at `/_src/index.js`.

## Future Considerations/To-Dos
- [ ] Add environment differences
- [ ] Add if/else for serve in gulpfile.babel.js
- [ ] Revisit .htaccess file
- [ ] Add Tree shaking
