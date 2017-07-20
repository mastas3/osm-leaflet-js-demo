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
        draw.polyline();
      };

      drawCircleButton.onclick = function(_e) {
        draw.circle();
      };

      drawPolyGonButton.onclick = function(_e) {
        draw.polygon();
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
    this.coordinatesArr = [];
    this.shapesHistoryArr = _shapesHistoryArr;
    this.drawingManager = _drawingManager;
    this.drawnItems = _drawnItems;
    this.map = _map;
    this.map.on("draw:created", _e => this.drawOnMap(_e.layer));
  };

  this.polygon = function() {
    try {
      var polygon = new L.Draw.Polygon(this.map, this.drawingManager);
      polygon.enable();
      this.shapesHistoryArr.push(polygon);
    } catch (_error) {
      console.log("DrawPolyShape.polygon error", _error);
    }
  };

  this.polyline = function() {
    try {
      var polyline = new L.Draw.Polyline(this.map, this.drawingManager);
      polyline.enable();
      this.shapesHistoryArr.push(polyline);
    } catch (_error) {
      console.log("DrawPolyShape.polyline error", _error);
    }
  };

  this.circle = function() {
    try {
      var circle = new L.Draw.Circle(this.map, this.drawingManager);
      circle.enable();
      circle.on('click', function() {
        var editCircle = new L.Edit.Circle(this.map, this.drawingManager);
        editCircle.enable();
      })
      this.shapesHistoryArr.push(circle);
    } catch (_error) {
      console.log("DrawPolyShape.circle error", _error);
    }
  };

  //event handler on this.map (draw:created event)
  this.drawOnMap = function(_layer) {
    try {
      this.drawnItems.addLayer(_layer);
      //if layer is circle - get its radius and center, otherwise its a polyline or polygon
      _layer.options.radius ? this.getCircleRadandCenter(_layer) : this.getCoords(_layer);
    } catch (_error) {
      console.log("DrawPolyShape.drawOnMap error", _error);
    }
  };

  this.getCoords = function(_layer) {
    try {
      function smartPush(_fullCoordArr, _newCoordArr) {
        try {
          for (var i = 0; i < _fullCoordArr.length; i++) {
            if (_fullCoordArr[i][0] === _newCoordArr[0] && _fullCoordArr[i][1] === _newCoordArr[1]) {
              return _fullCoordArr;
            }
          }
          _fullCoordArr.push(_newCoordArr);
          return _fullCoordArr;
        } catch (_error) {
          console.log("DrawPolyShape.getCoords smartPush error", _error);
        }
      }

      var coords = _layer.toGeoJSON().geometry.coordinates;
      this.coordinatesArr = smartPush(this.coordinatesArr, coords);
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
}
