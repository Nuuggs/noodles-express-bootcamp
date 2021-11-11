import express from 'express';
import { read } from './jsonFileStorage.js';


// Testing!! Changes were made!

const app = express();
const dataFilePath = 'data.json';

const handleIncomingRequest = (req, res) => {
  const requestedData = req.params.index;
  console.log('incoming request...')

  const doReadCallback = (err, data) => {
    
    const content = data.recipes[requestedData];
    if ( content === undefined) {
      res.status(404).send('Sorry, we cannot find that!');
      return;
    }
    res.send(content);
  }

  
  read(dataFilePath, doReadCallback);
};

const handleYieldRequest = (req, res) => {
  const requestedIndex = Number(req.params.index);

  const doReadCallback = (err, dataObject) => {
  const dataArray = dataObject.recipes;
  console.log(dataArray[1].yield);
  let content = '';
  dataArray.forEach((element) => {
    console.log('for each...');
    console.log(element.yield);
    console.log(requestedIndex);
    console.log(element.yield === requestedIndex);
    if (element.yield === requestedIndex) {
      content += JSON.stringify(element);
      content += '\n';
    }
  });
  res.send(content);
  }
  read(dataFilePath, doReadCallback);
};

const handleLabelRequest = (req, res) => {
  let requestedLabel = req.params.label;
  
  const doReadCallbackForLabel = (err, dataObject) => {
    const dataArray = dataObject.recipes;
    let content = '';
    dataArray.forEach((element) => {
      const elementLabel = element.label;
      let comparisonLabel = elementLabel.toLowerCase();
      if ( comparisonLabel.includes(' ') ) {
        comparisonLabel = comparisonLabel.replaceAll(' ', '-');
      }

      if (requestedLabel === comparisonLabel) {
        content = element;
        res.send(content);
        return;
      }
    });
    res.send('label not found, please try again!');
  };
  read(dataFilePath, doReadCallbackForLabel);
};

app.get('/recipe/:index', handleIncomingRequest);
app.get('/yield/:index', handleYieldRequest);
app.get('/recipe-label/:label', handleLabelRequest);

app.listen(3004);