function batched(batchSize, stream) {
  stream = stream || this;
  var output = stream.clone();
  var batch;
  var counter = 0;
  output.flush = function() {
    if (batch) {
      batch.end();
      batch = null;
    }
  }
  stream.each(function(entry) {
    if (counter % batchSize === 0) {
      output.flush();
      batch = stream.clone();
      batch.id = counter / batchSize;
      output.write(batch);
    }
    batch.write(entry);
    counter++;
  });
  stream.done(function() {
    output.flush();
  })
  return output;
}
module.exports = batched;