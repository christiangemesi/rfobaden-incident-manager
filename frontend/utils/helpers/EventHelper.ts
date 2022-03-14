import React from 'react'

class EventHelper {
  stopPropagation(e: React.SyntheticEvent) {
    e.stopPropagation()
  }
}
export default new EventHelper()
