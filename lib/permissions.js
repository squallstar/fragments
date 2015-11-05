ownsDocument = function(userId, doc) {
  return doc && doc.user === userId;
}