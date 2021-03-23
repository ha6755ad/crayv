<script>
  export default {
    name: 'mapMixins',
    computed: {
      computeCenter(points) {
        if (typeof points === 'undefined') {
          return {lat: 40.431259, lng: -111.891739};
        } else {
          if (points.length === 1) return {
            lat: parseFloat(points[0].position.lat),
            lng: parseFloat(points[0].position.lng)
          };

          const lats = points.map(point => {
            return point.position.lat;
          });

          const lngs = points.map(point => {
            return point.position.lng;
          });

          const avgLat = lats.reduce((a, b) => a + b) / lats.length;
          const avgLng = lngs.reduce((a, b) => a + b) / lngs.length;

          return {
            lat: avgLat,
            lng: avgLng
          };
        }
      },
    },
    methods: {
      mapCenter() {
        if (typeof this.marks !== 'undefined') {
          return this.computeCenter(this.marks);
        }
        if (typeof this.path !== 'undefined') {
          return this.computeCenter(this.path);
        }
      },
      setMapOptions(google, options, update) {
        if (typeof update == 'undefined') update = false;
        if (typeof options == 'undefined' || !options) options = [];
        if (typeof options['center'] == 'undefined' || update) options['center'] = new google.maps.LatLng(this.mapCenter.lat, this.mapCenter.lng);
        if (typeof options['zoom'] == 'undefined') options['zoom'] = 1;
        if (typeof options['mapTypeId'] == 'undefined') options['mapTypeId'] = google.maps.MapTypeId.ROADMAP;
        if (typeof options['tilt'] == 'undefined' || update) options['tilt'] = 0;
        return options;
      },

      getClientLocation(google, map,) {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });
        // eslint-disable-next-line no-undef
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            // eslint-disable-next-line no-undef
            infoWindow.setPosition(pos);
            // eslint-disable-next-line no-undef
            infoWindow.setContent('Location found.');
            // eslint-disable-next-line no-undef
            infoWindow.open(map);
            map.setCenter(pos);
          }, function () {
            // eslint-disable-next-line no-undef
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          // eslint-disable-next-line no-undef
          handleLocationError(false, infoWindow, map.getCenter());
        }
      },

      handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
        // eslint-disable-next-line no-undef
        infoWindow.open(map);
      },

      convexHull() {
        // eslint-disable-next-line no-console
        // console.log("convexHull()");
        // console.log(obj.length);
        //check if there are more than one user, otherwise convex hull calculation would be useless
        // eslint-disable-next-line no-undef
        if (obj.length > 0) {
          //lists with x-positions and y-positions
          var pos_x = [];
          var pos_y = [];
          //fill the lists
          // eslint-disable-next-line no-undef
          for (var i = 0; i < obj.length; i++) {
            // eslint-disable-next-line no-undef
            pos_y.push(parseFloat(obj[i][1]));
            // eslint-disable-next-line no-undef
            pos_x.push(parseFloat(obj[i][2]));
          // eslint-disable-next-line no-console
          // console.log("point " + i + ": lat = " + pos_y[i] + ", lon = " + pos_x[i]);
          }
          //find lowest point index
          var low_index = 0;
          // eslint-disable-next-line no-undef,no-redeclare
          for (var i = 1; i < obj.length; i++) {
            if (pos_y[i] < pos_y[low_index]) {
              low_index = i;
            }
          }
          var angle_list = [];
          //make list of angles linked to index, the lowest point will not be in this list
          // eslint-disable-next-line no-undef,no-redeclare
          for (var i = 0; i < obj.length; i++) {
            if (i != low_index) {
              var opos = pos_y[i] - pos_y[low_index];
              var adj = pos_x[i] - pos_x[low_index];
              //opos will always be positive, since the point with index low_index is the lowest point
              if (adj > 0) {
                // eslint-disable-next-line no-undef,no-redeclare
                var new_angle = Math.atan(opos / adj);
                // eslint-disable-next-line no-undef,no-redeclare
                var list_item = {index: i, angle: new_angle};
                angle_list.push(list_item);
              }
              if (adj < 0) {
                // eslint-disable-next-line no-undef,no-redeclare
                var new_angle = Math.atan(opos / adj) + Math.PI;
                // eslint-disable-next-line no-undef,no-redeclare
                var list_item = {index: i, angle: new_angle};
                angle_list.push(list_item);
              }
              if (adj == 0) { //if adj = 0, angle is 90 degrees
                // eslint-disable-next-line no-undef,no-redeclare
                var new_angle = 90;
                // eslint-disable-next-line no-undef,no-redeclare
                var list_item = {index: i, angle: new_angle};
                angle_list.push(list_item);
              }
            }
          }
          //sort angle_list by ascending angles
          angle_list = angle_list.sort(function (a, b) {
            return a.angle - b.angle;
          });
          // eslint-disable-next-line no-undef,no-redeclare
          for (var i = 0; i < angle_list.length; i++) {
          // eslint-disable-next-line no-console
          // console.log("angle = " + angle_list[i].angle + ", index = " + angle_list[i].index);
          }
          //GRAHAM ALGORITHM STARTS HERE
          //this list will hold all indexes of convex points
          var final_list = [];
          //put the lowest point in the angle_list
          // eslint-disable-next-line no-undef,no-redeclare
          var list_item = {index: low_index, angle: 0};
          angle_list.unshift(list_item);

          //NEW STUFF HERE
          //eerst het beginpunt met laagste y-coor invoegen
          //english: inserting the starting point [lowest y coordinate]
          final_list.unshift(angle_list[0]);
          // eslint-disable-next-line no-undef,no-redeclare
          for (var i = 2; i < angle_list.length; i++) {
            var value = (((pos_x[angle_list[i - 1].index] - pos_x[angle_list[i - 2].index]) * (pos_y[angle_list[(i)].index] - pos_y[angle_list[i - 2].index])) - ((pos_y[angle_list[i - 1].index] - pos_y[angle_list[i - 2].index]) * (pos_x[angle_list[(i)].index] - pos_x[angle_list[i - 2].index])));
            //left turn, this is good
            if (value > 0) {
              // eslint-disable-next-line no-console
              // console.log("left turn");
              final_list.push(angle_list[i - 1]);
            }
            //right turn, this is not good
            if (value < 0) {
              // eslint-disable-next-line no-console
              // console.log("right turn");
              continue;
            }
            //points lie on a line
            if (value == 0) {
              final_list.push(angle_list[i - 1]);
            // eslint-disable-next-line no-console
            // console.log("colinear");
            }
          }
        }
        setTimeout(function () {
          // eslint-disable-next-line no-undef
          convexHull();
        }, 5000);
        // eslint-disable-next-line no-console
        // console.log(final_list);//this is what the console outputs: [Object, Object, Object, Object, Object] I don't understand why it has this structure!
        return final_list;
      },

      DrawHull(final_list) {
        for (var i = 0; i < final_list.length - 1; i++) {
          // eslint-disable-next-line no-undef
          // console.log(parseFloat(obj[final_list[i]]));
          // eslint-disable-next-line no-undef
          var p1 = new L.LatLng(parseFloat(obj[final_list[i]][1]), parseFloat
            // eslint-disable-next-line no-undef,no-unexpected-multiline
            (obj[final_list[i]][2]));
          // eslint-disable-next-line no-undef
          var p2 = new L.LatLng(parseFloat(obj[final_list[i + 1]][1]), parseFloat(obj[final_list[i + 1]][2]));
          var pointList = [p1, p2];
          // eslint-disable-next-line no-undef
          polylines.push(new L.polyline(pointList, {
            color: 'yellow',
            weight: 10,
            opacity: 0.5,
            smoothFactor: 1
          // eslint-disable-next-line no-undef
          }).addTo(mymap));
        }
      },


      // Copyright 2001, softSurfer (www.softsurfer.com)
      // This code may be freely used and modified for any purpose
      // providing that this copyright notice is included with it.
      // SoftSurfer makes no warranty for this code, and cannot be held
      // liable for any real or imagined damage resulting from its use.
      // Users of this code must verify correctness for their application.
      // http://softsurfer.com/Archive/algorithm_0203/algorithm_0203.htm
      // Assume that a class is already given for the object:
      //    Point with coordinates {float x, y;}
      //===================================================================

      // isLeft(): tests if a point is Left|On|Right of an infinite line.
      //    Input:  three points P0, P1, and P2
      //    Return: >0 for P2 left of the line through P0 and P1
      //            =0 for P2 on the line
      //            <0 for P2 right of the line

      sortPointX(a, b) {
        return a.lng() - b.lng();
      },
      sortPointY(a, b) {
        return a.lat() - b.lat();
      },

      isLeft(P0, P1, P2) {
        return (P1.lng() - P0.lng()) * (P2.lat() - P0.lat()) - (P2.lng() - P0.lng()) * (P1.lat() - P0.lat());
      },
      //===================================================================

      // chainHull_2D(): A.M. Andrew's monotone chain 2D convex hull algorithm
      // http://softsurfer.com/Archive/algorithm_0109/algorithm_0109.htm
      //
      //     Input:  P[] = an array of 2D points
      //                   presorted by increasing x- and y-coordinates
      //             n = the number of points in P[]
      //     Output: H[] = an array of the convex hull vertices (max is n)
      //     Return: the number of points in H[]


      chainHull_2D(P, n, H) {
        // the output array H[] will be used as the stack
        var bot = 0,
            top = (-1); // indices for bottom and top of the stack
        var i; // array scan index
        // Get the indices of points with min x-coord and min|max y-coord
        var minmin = 0,
            minmax;

        var xmin = P[0].lng();
        for (i = 1; i < n; i++) {
          if (P[i].lng() != xmin) {
            break;
          }
        }

        minmax = i - 1;
        if (minmax == n - 1) { // degenerate case: all x-coords == xmin
          H[++top] = P[minmin];
          if (P[minmax].lat() != P[minmin].lat()) // a nontrivial segment
            H[++top] = P[minmax];
          H[++top] = P[minmin]; // add polygon endpoint
          return top + 1;
        }

        // Get the indices of points with max x-coord and min|max y-coord
        var maxmin, maxmax = n - 1;
        var xmax = P[n - 1].lng();
        for (i = n - 2; i >= 0; i--) {
          if (P[i].lng() != xmax) {
            break;
          }
        }
        maxmin = i + 1;

        // Compute the lower hull on the stack H
        H[++top] = P[minmin]; // push minmin point onto stack
        i = minmax;
        while (++i <= maxmin) {
          // the lower line joins P[minmin] with P[maxmin]
          // eslint-disable-next-line no-undef
          if (isLeft(P[minmin], P[maxmin], P[i]) >= 0 && i < maxmin) {
            continue; // ignore P[i] above or on the lower line
          }

          while (top > 0) { // there are at least 2 points on the stack
            // test if P[i] is left of the line at the stack top
            // eslint-disable-next-line no-undef
            if (isLeft(H[top - 1], H[top], P[i]) > 0) {
              break; // P[i] is a new hull vertex
            } else {
              top--; // pop top point off stack
            }
          }

          H[++top] = P[i]; // push P[i] onto stack
        }

        // Next, compute the upper hull on the stack H above the bottom hull
        if (maxmax != maxmin) { // if distinct xmax points
          H[++top] = P[maxmax]; // push maxmax point onto stack
        }

        bot = top; // the bottom point of the upper hull stack
        i = maxmin;
        while (--i >= minmax) {
          // the upper line joins P[maxmax] with P[minmax]
          // eslint-disable-next-line no-undef
          if (isLeft(P[maxmax], P[minmax], P[i]) >= 0 && i > minmax) {
            continue; // ignore P[i] below or on the upper line
          }

          while (top > bot) { // at least 2 points on the upper stack
            // test if P[i] is left of the line at the stack top
            // eslint-disable-next-line no-undef,no-redeclare
            if (isLeft(H[top - 1], H[top], P[i]) > 0) {
              break;  // P[i] is a new hull vertex
            } else {
              top--; // pop top point off stack
            }
          }

          if (P[i].lng() == H[0].lng() && P[i].lat() == H[0].lat()) {
            return top + 1; // special case (mgomes)
          }

          H[++top] = P[i]; // push P[i] onto stack
        }

        if (minmax != minmin) {
          H[++top] = P[minmin]; // push joining endpoint onto stack
        }

        return top + 1;
      },

      getConvexHullOfPoints(pointsList) {
        if (pointsList.isArray) {
          var hullPoints = [];
          var hullPoints_size = null;

          // Sort the points by X, then by Y (required by the algorithm)
          pointsList.sort(this.sortPointY);
          pointsList.sort(this.sortPointX);

          // Calculate the convex hull
          // Takes: an (1) array of points with x() and y() methods defined
          //          (2) Size of the points array
          //          (3) Empty array to store the hull points
          // Returns: The number of hull points, which may differ the the hull points array’s size
          hullPoints_size = this.chainHull_2D(pointsList, pointsList.length, hullPoints);
          if (hullPoints_size > 0) {
            return hullPoints;
          }
        }
      }


    }
  };
</script>
