# Push

When the client finishes an update, data is persisted to the backend. We collect the mutations and then "flush" the collection through one transaction against the database.
