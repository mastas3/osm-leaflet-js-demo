window.onload = initMap;

function initMap() {
  var center = [32.109333, 34.855499]; //israel
  var zoomLevel = 11;
  var map = L.map("map").setView(center, zoomLevel);
  var shapesHistoryArr = [];
  var draw = new DrawPolyShape();

  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {}).addTo(map);

  //allow drawing on the map
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  var drawControl = new L.Control.Draw({
    draw: false //we set draw=false to hide default leaflet button toolbar
  });

  //set event handlers
  (function setButtonsAndMapEventHandlers() {
    try {
      draw.init(shapesHistoryArr, drawControl, drawnItems, map);
      var drawPolyLineButton = document.getElementById("drawPolyLineButton");
      var drawCircleButton = document.getElementById("drawCircleButton");
      var drawPolyGonButton = document.getElementById("drawPolyGonButton");
      var clearButton = document.getElementById("clearButton");

      drawPolyLineButton.onclick = function(_e) {
        draw.polyline(_e);
      };

      drawCircleButton.onclick = function(_e) {
        draw.circle(_e);
      };

      drawPolyGonButton.onclick = function(_e) {
        draw.polygon(_e);
      };

      clearButton.onclick = function(_e) {
        // L.EditToolbar.Delete(map, drawControl)
        // while (shapesHistoryArr.length > 0) {
        //   shapesHistoryArr.pop().setMap(null);
        // }
      };
    } catch (_error) {
      console.log("setButtonsAndMapEventHandlers error: ", _error);
    }
  })();
}

function DrawPolyShape() {
  this.init = function(_shapesHistoryArr, _drawingManager, _drawnItems, _map) {
    this.shapesHistoryArr = _shapesHistoryArr;
    this.drawingManager = _drawingManager;
    this.drawnItems = _drawnItems;
    this.map = _map;
  };

  this.polygon = function(_e) {
    try {
      var polygon = new L.Draw.Polygon(this.map, this.drawingManager);
      polygon.enable();
      this.map.on('draw:created', (_e) => this.drawOnMap(_e.layer));
      this.shapesHistoryArr.push(polygon);
    } catch (_error) {
      console.log("DrawPolyShape.polygon error", _error);
    }
  };

  this.polyline = function(_e) {
    try {
      var polyline = new L.Draw.Polyline(this.map, this.drawingManager);
      polyline.enable();
      this.map.on('draw:created', (_e) => this.drawOnMap(_e.layer));
      this.shapesHistoryArr.push(polyline);
    } catch (_error) {
      console.log("DrawPolyShape.polyline error", _error);
    }
  };

  this.circle = function(_e) {
    try {
      var circle = new L.Draw.Circle(this.map, this.drawingManager);
      circle.enable();
      this.map.on('draw:created', (_e) => this.drawOnMap(_e.layer));
      this.shapesHistoryArr.push(circle);
      console.log(circle)
    } catch (_error) {
      console.log("DrawPolyShape.circle error", _error);
    }
  };

  this.drawOnMap = function(_layer) {
    try {
      this.drawnItems.addLayer(_layer);
    } catch (_error) {
      console.log('DrawPolyShape.drawOnMap error', _error)
    }
  }
}

