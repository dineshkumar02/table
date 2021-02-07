import _ from 'lodash';
import calculateMaximumColumnWidthIndex from './calculateMaximumColumnWidthIndex';
import getBorderCharacters from './getBorderCharacters';
import pgDataTypes from './pgDataTypes';
import validateConfig from './validateConfig';

/**
 * Merges user provided border characters with the default border ("honeywell") characters.
 *
 * @param {object} border
 * @returns {object}
 */
const makeBorder = (border = {}) => {
  return Object.assign({}, getBorderCharacters('honeywell'), border);
};

/**
 * Creates a configuration for every column using default
 * values for the missing configuration properties.
 *
 * @param {Array[]} rows
 * @param {object} columns
 * @param {object} columnDefault
 * @returns {object}
 */
const makeColumns = (rows, columns = {}, columnDefault = {}) => {
  // XXX
  // The first row for each table data is the data type for each column
  // Remove it from the array, and do alignment based on the data type.
  const dataTypes = rows.shift();
  const maximumColumnWidthIndex = calculateMaximumColumnWidthIndex(rows);
  let align='';

    _.times(rows[0].length, (index) => {
      if (_.isUndefined(columns[index])) {
        columns[index] = {};
      }

      if (dataTypes[index] in pgDataTypes) {
        // found data type default alignments
        align = pgDataTypes[dataTypes[index]].align;
      } else {
        // unknow data type, so setting the alignment as left
        align = 'left';
      }

      
      columns[index] = Object.assign({
        alignment: align,
        paddingLeft: 1,
        paddingRight: 1,
        truncate: Number.POSITIVE_INFINITY,
        width: maximumColumnWidthIndex[index],
        wrapWord: false,
      }, columnDefault, columns[index]);
    });
  return columns;
};

/**
 * Makes a new configuration object out of the userConfig object
 * using default values for the missing configuration properties.
 *
 * @param {Array[]} rows
 * @param {object} userConfig
 * @returns {object}
 */
export default (rows, userConfig = {}) => {
  validateConfig('config.json', userConfig);

  const config = _.cloneDeep(userConfig);

  config.border = makeBorder(config.border);
  config.columns = makeColumns(rows, config.columns, config.columnDefault);

  if (!config.drawHorizontalLine) {
    /**
         * @returns {boolean}
         */
    config.drawHorizontalLine = () => {
      return true;
    };
  }

  if (config.singleLine === undefined) {
    config.singleLine = false;
  }

  return config;
};
