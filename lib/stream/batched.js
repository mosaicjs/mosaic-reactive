function batched(batchSize, stream) {
  stream = stream || this;
  var output = stream.clone(true);
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
    try {
      output.flush();
    } finally {
      output.end();
    }
  })
  return output;
}
module.exports = batched;