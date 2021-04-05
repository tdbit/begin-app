@app
node-events

@http
post /my-event
post /search

@static

@events
my-event
search
fetch
analyse
capture

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