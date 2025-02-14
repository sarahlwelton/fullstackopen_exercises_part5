const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else if (!authorization) {
    response.status(401).json({ error: 'Invalid token' })
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    response.status(401).json({ error: 'Invalid token' })
  } else {
    const user = await User.findById(decodedToken.id)
    request.user = user
  }
  next()
}

module.exports = { tokenExtractor, userExtractor }