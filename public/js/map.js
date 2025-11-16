
        mapboxgl.accessToken = mapToken;
        if(coordinates && coordinates.length == 2){
           const map = new mapboxgl.Map({
           container: 'map', // container ID
           center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
           zoom: 10 // starting zoom
          });
           console.log(coordinates);
           const marker = new mapboxgl.Marker({color : "red"})
            .setLngLat(coordinates)
            .addTo(map);

    }else{
        console.log("Invalid coordinates", coordinates);
    }

