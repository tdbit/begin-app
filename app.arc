@app
node-events

@http
post /my-event
post /search

@static

@events
search
fetch
analyse

@tables
data
  scopeID *String
  dataID **String
  ttl TTL

images
  scopeID *String
  dataID **String
  ttl TTL
  
queries
  scopeID *String
  dataID **String
  ttl TTL
  email String