# beatstore

A marketplace to sell your beats.

## Development

Make sure to add `dev.js` to `/server/config/` with your MongoDB URI and JWT secret:

```javascript
module.exports = {
    mongoURI: 'mongoDB uri here',
    jwtSecret: 'your jwt secret here'
}
```

## Acknowledgments

* [John Ahn's MERN Boilerplate](https://github.com/jaewonhimnae/boilerplate-mern-stack)
