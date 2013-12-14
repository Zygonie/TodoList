function listMariageCtrl($scope, $log, $location, mariageEntries) {

    $scope.data = {};
    $scope.isCollapsed = {};
    $scope.buttonText = 'Create';
    $scope.query = "";
    $scope.loaded = false;
    $scope.doneEntriesPresent = false;
    $scope.formOn = false;

    //Spinner
    var opts = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementById('spinner');
    var spinner = new Spinner(opts).spin(target);

    $scope.searchNotDone = function (item) {
        return $scope.search(item, false);
    };

    $scope.searchDone = function (item) {
        return $scope.search(item, true);
    };

    $scope.search = function (item, isDone) {
        if (item.done == isDone) {
            if ($scope.query == "") {
                return true;
            }
            return false;
        }
        return false;
    };
    
    function isDefined(x) {
        var undefined;
        return x !== undefined;
    }

    $scope.init = function () {
        $scope.isCollapsed = true;
        mariageEntries.query(function (res) {
            $scope.data.entries = res;
            for (idx in $scope.data.entries) {
                if ($scope.data.entries[idx].done) {
                    doneEntriesPresent = true;
                    break;
                }
            }
            $scope.loaded = true;
            spinner.stop();
        });
    };

    function create() {
        $scope.isCollapsed = true;
        var newEntry = new mariageEntries($scope.entry);
        newEntry.$create(function (entry) {
            if (!entry)
                $log.log('Impossible to create new mariage entry');
            else {
                $scope.data.entries.push(entry);
            }
        });
    };

    function update(entry) {
        $scope.isCollapsed = true;
        var id = entry._id;
        entry.$update({ Id: id }, function (entry) {
            if (!entry)
                $log.log('Impossible to update mariage entry');
        });
    };

    $scope.action = function () {
        if ($scope.buttonText == 'Create')
            create();
        else
            update($scope.entry);
    };


    $scope.cancel = function () {
        $scope.isCollapsed = true;
        $location.path('/home');
    };

    $scope.remove = function (entry) {
        var id = entry._id;
        entry.$remove({ Id: id }, function (entry) {
            for (idx in $scope.data.entries) {
                if ($scope.data.entries[idx] == entry) {
                    $scope.data.entries.splice(idx, 1);
                }
            }
        });
    };

    $scope.edit = function (entry, e) {
        if (e) {
            e.preventDefault(); //pour empecher que le content soit développé
            e.stopPropagation();
        }
        $scope.entry = entry;
        $scope.buttonText = 'Update';
        $scope.isCollapsed = false;
    };

    $scope.showPanel = function () {
        $scope.entry = {};
        $scope.buttonText = 'Create';
        $scope.isCollapsed = false;
    };

    $scope.chgState = function (item) {
        var id = item._id;
        item.done = !item.done;
        item.$update({ Id: id }, function (entry) {
            if (!entry)
                $log.log('Impossible to update mariage entry');
        });   	
    };
}