window.onload = initMap;

function initMap() {
  var center = [32.109333, 34.855499]; //israel
  var zoomLevel = 11;
  var map = L.map("map", { editable: true }).setView(center, zoomLevel);
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
        draw.polyline();
      };

      drawCircleButton.onclick = function(_e) {
        draw.circle();
      };

      drawPolyGonButton.onclick = function(_e) {
        draw.polygon();
      };

      clearButton.onclick = function(_e) {
        try {
          shapesHistoryArr.forEach(_layer => map.removeLayer(_layer));
        } catch (_error) {
          console.log("clearButton error: ", _error);
        }
      };
    } catch (_error) {
      console.log("setButtonsAndMapEventHandlers error: ", _error);
    }
  })();
}

function DrawPolyShape() {
  this.init = function(_shapesHistoryArr, _drawingManager, _drawnItems, _map) {
    this.coordinatesArr = [];
    this.shapesHistoryArr = _shapesHistoryArr;
    this.drawingManager = _drawingManager;
    this.drawnItems = _drawnItems;
    this.map = _map;
    this.map.on("draw:created", _e => this.drawOnMap(_e.layer));
    // this.map.on("draw:editmove", _e => this.getShapeData(_e.layer));
    // this.map.on("draw:editresize", _e => this.getShapeData(_e.layer));
  };

  this.polygon = function() {
    try {
      var polygon = new L.Draw.Polygon(this.map, this.drawingManager);
      polygon.enable();
    } catch (_error) {
      console.log("DrawPolyShape.polygon error", _error);
    }
  };

  this.polyline = function() {
    try {
      var polyline = new L.Draw.Polyline(this.map, this.drawingManager);
      polyline.enable();
    } catch (_error) {
      console.log("DrawPolyShape.polyline error", _error);
    }
  };

  this.circle = function() {
    try {
      var circle = new L.Draw.Circle(this.map, this.drawingManager);
      circle.enable();
    } catch (_error) {
      console.log("DrawPolyShape.circle error", _error);
    }
  };

  //event handler on this.map (draw:created event)
  this.drawOnMap = function(_layer) {
    try {
      editingFunctionality(_layer);
      this.shapesHistoryArr.push(_layer); //keep reference to _layer in order to delete it in the future
      this.drawnItems.addLayer(_layer);
      //if layer is circle - get its radius and center, otherwise its a polyline or polygon
      this.getShapeData(_layer);
    } catch (_error) {
      console.log("DrawPolyShape.drawOnMap error", _error);
    }
  };

  this.getShapeData = function(_layer) {
    try {
      _layer.options.radius ? this.getCircleRadandCenter(_layer) : this.getCoords(_layer);
    } catch (error) {
      console.log("DrawPolyShape.getShapeData error", _error);
    }
  };

  this.getCoords = function(_layer) {
    try {
      var coords = _layer.toGeoJSON().geometry.coordinates;
      console.log(coords);
    } catch (_error) {
      console.log("DrawPolyShape.getCoords error", _error);
    }
  };

  this.getCircleRadandCenter = function(_circle) {
    try {
      var radius = _circle.getRadius();
      var center = _circle.getLatLng();
      console.log("radius: " + radius, "center: " + center);
    } catch (_error) {
      console.log("DrawPolyShape.getCircleRadandCenter error", _error);
    }
  };

  var editingFunctionality = (_layer) => {
    try {
      _layer.on("click", () => {
        if (_layer.editing.enabled()) {
          _layer.editing.disable();
          this.getShapeData(_layer);
        } else {
          _layer.editing.enable();
        }
      });
    } catch (_error) {
      console.log("editingFunctionality error", _error);
    }
  };
}
