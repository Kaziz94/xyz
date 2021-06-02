import filter from './filter/_filter.mjs'

import draw from './draw/_draw.mjs'

import data from './data.mjs'

import report from './report.mjs'

import download from './download.mjs';

export default _xyz => {

  const view = {

    filter: filter(_xyz),

    draw: draw(_xyz),

    report: report(_xyz),

    data: data(_xyz),

    download: download(_xyz)

  }

  return view

}