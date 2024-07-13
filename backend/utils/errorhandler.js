// extends means we inharit the default class from the node 

class Errorhandler extends Error{
  constructor(message,statuscode){
    super(message)
    this.statuscode = statuscode
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = Errorhandler 