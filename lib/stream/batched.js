function batched(batchSize, stream) {
  stream = stream || this;
  var output = stream.clone();
  var batch;
  var counter = 0;
  stream.each(function(entry) {
    if (counter % batchSize === 0) {
      if (batch) {
        batch.end();
      }
      batch = stream.clone();
      batch.id = counter / batchSize;
      output.write(batch);
    }
    batch.write(entry);
    counter++;
  });
  stream.done(function() {
    if (batch) {
      batch.end();
    }
  })
  return output;
}
module.exports = batched;