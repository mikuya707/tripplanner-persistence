// 'use strict';
/* global $ mapModule */
var daysModule = (function () {
    var exports = {},
        days = [],
        currentDay; // = days[0];

    // Works
    function addDay() {
        var index = days.length + 1;
        console.log(index);
        $.ajax({
            url: "/api/days/" + index,
            method: "post",
            success: function (day) {
                days.push(day);
                currentDay = days[days.length-1];
                renderDayButtons();
                switchDay(days.length - 1);
                console.log("add", days);
            },
            error: function (err) {
                return err;
            }
        });
    }

    // Works
    function switchDay(index) {
        var $title = $('#day-title');
        if (index >= days.length) index = days.length - 1;
        $title.children('span').remove();
        $title.prepend('<span>Day ' + (index + 1) + '</span>');
        currentDay = days[index];
        renderDay();
        renderDayButtons();
    }

    // DOESNT WORK
    function removeCurrentDay() {
        if (days.length === 1) return;
        var index = days.indexOf(currentDay);
        days.splice(index, 1);
        switchDay(index);
    }

    // WORKS
    function renderDayButtons() {
        var $daySelect = $('#day-select');
        $daySelect.empty();
        days.forEach(function (day, i) {
            $daySelect.append(daySelectHTML(day, i, day === currentDay));
        });
        $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
    }

    // WORKS
    function daySelectHTML(day, i, isCurrentDay) {
        return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
    }

    // WORKS
    exports.addAttraction = function (attraction) {
        if (attraction.type === 'hotels') {
            $.ajax({
                url: '/api/days/' + currentDay._id + '/hotel',
                method: 'post',
                data: {
                    hotelId: attraction._id
                },
                success: function (day) {
                    renderDay(day);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        } else {
            if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
            else {
                var type = attraction.type;
                $.ajax({
                    url: '/api/days/' + currentDay._id + '/' + type,
                    method: 'post',
                    data: {
                        type: attraction._id
                    },
                    success: function (day) {
                        renderDay(day);
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
        }
    };
    // Works
    exports.removeAttraction = function (attraction) {
        if (attraction.type === 'hotels') {
          $.ajax({
              url: '/api/days/' + currentDay._id + '/hotel',
              method: 'delete',
              success: function (day) {
                  console.log('yay');
              },
              error: function (err) {
                  console.log(err);
              }
          });
        } else {
          var type = attraction.type;
          $.ajax({
              url: '/api/days/' + currentDay._id + '/' + type,
              method: 'delete',
              data: {
                  idNum: attraction._id
              },
              success: function (day) {
                  console.log('yay');
              },
              error: function (err) {
                  console.log(err);
              }
          });
          renderDay(currentDay);
        }
    };

    // works
    function renderDay(day) {
      mapModule.eraseMarkers();
      day = day || currentDay;
      Object.keys(day).forEach(function(key){
        if (key === 'hotels') {
          var $list = $('#itinerary ul[data-type="' + key + '"]');
          $list.empty();
          $list.append(itineraryHTML(day[key], key));
          mapModule.drawAttraction(day[key]);
        } else if (key === 'restaurants' || key === 'activities') {
          var $list = $('#itinerary ul[data-type="' + key + '"]');
          $list.empty();
          day[key].forEach(function(attraction){
            $list.append(itineraryHTML(attraction, key));
            mapModule.drawAttraction(attraction);
          });
        }
      });
    }

    // Works
    function itineraryHTML(attraction, key) {
        return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + key + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
    }

    // WORKS
    function loadDays() {
        $.ajax({
            url: "/api/days/",
            method: "get",
            success: function (days) {
              if (days.length === 0) {
               addDay(); 
              }
              else {
               days = days;
               currentDay = days[0];

               renderDayButtons();
               renderDay();
              }
            },
            error: function (err) {
                return err;
            }
        });
    }

    $(document).ready(function () {
        loadDays();
        $('.day-buttons').on('click', '.new-day-btn', addDay);
        $('.day-buttons').on('click', 'button:not(.new-day-btn)', function () {
            switchDay($(this).index());
        });
        $('#day-title').on('click', '.remove', removeCurrentDay);
    });
    return exports;
}());
