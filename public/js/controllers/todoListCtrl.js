function todoListCtrl($scope, $log, $location, $route, $routeParams, ListService, TaskService, sharedService) {

    $scope.isCollapsed = {};
    $scope.buttonText = 'Create';
    $scope.query = "";
    $scope.loaded = false;
    $scope.doneEntriesPresent = false;
    $scope.formOn = false;
    $scope.tasksPresent = false;
    $scope.doneTasksPresent = false;
    $scope.toFocus = false;

    /***************
     *** Spinner ***
     ***************/
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
    
    /*************
     *** Tools ***
     *************/
    function isDefined(x) {
        var undefined;
        return x !== undefined;
    }

    function isUrl(s) {
        var regexp = /((http|https|ftp)\:\/\/)?([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$/;
        //var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);
    }

    function urlStartsWithHttp(url) {
        var regexp = /((http|https|ftp)\:\/\/).+/;
        return regexp.test(url);
    }

    function checkForUrlInTaskDescription(task) {
        var texte = task.description;
        var words = texte.split(" ");
        for (var i = 0; i < words.length; i++) {
            if (isUrl(words[i])) {
                var link = {};
                if (urlStartsWithHttp(words[i])) {
                    link = '<a href="' + words[i] + '" target="_blank" rel="nofollow">' + words[i] + '</a>';
                }
                else {
                    link = '<a href="http://' + words[i] + '" target="_blank" rel="nofollow">' + words[i] + '</a>';
                }
                words[i] = words[i].replace(words[i], link);
            }
        }
        task.description = words.join(" ");
    }

    /*************
     *** Lists ***
     *************/
    $scope.initLists = function () {
        $scope.data = sharedService.data;
        $scope.isCollapsed = true;
        $scope.toFocus = false;
        ListService.query(
            function (res) { //success
                $scope.data.Lists = res;
                $scope.loaded = true;
                spinner.stop();
            },
            function (err) { //error
            });
    };    

    $scope.showDetails = function(listItem)
    {
        $scope.data.list = listItem;
        if($location.path() === '/todoList/details')
            $route.reload();
        else
            $location.path('/todoList/details');
    };

    function createList() {
        $scope.isCollapsed = true;
        var newList = new ListService($scope.newlist);
        newList.$save(
            function (list) { //success
                if (!list)
                    $log.log('Impossible to create new todoList entry');
                else {
                    $scope.data.Lists.push(list);
                    $location.path('/todoList/home');
                }
            },
            function (err) { //error
                $log.log('Impossible to create new todoList entry');
            });
    };

    function updateList() {
        $scope.isCollapsed = true;
        $scope.newlist.$save({Id: $scope.newlist._id},
            function (list) { //success
                if (!list)
                    $log.log('Impossible to update todoList entry');
            },
            function (err) { //error
            });
    };

    $scope.removeList = function (list,e) {
        if (e) {
            e.preventDefault(); //pour empecher que le content soit développé
            e.stopPropagation();
        }
        var id = list._id;
        list.$remove({ Id: id },
            function (list) { //success
                for (idx in $scope.data.Lists) {
                    if ($scope.data.Lists[idx] == list) {
                        $scope.data.Lists.splice(idx, 1);
                    }
                }
            },
            function (err) { //error
            });
    };

    $scope.editList = function (list, e) {
        if (e) {
            e.preventDefault(); //pour empecher que le content soit développé
            e.stopPropagation();
        }
        $scope.newlist = list;
        $scope.buttonText = 'Update';
        $scope.isCollapsed = false;
    };

    $scope.showNewListPanel = function () {
        $scope.newlist = {};
        $scope.buttonText = 'Create';
        $scope.isCollapsed = false;
        $scope.toFocus = true;
    };

    /*************
     *** Tasks ***
     *************/
    $scope.initTasks = function () {
        $scope.toFocus = false;
        $scope.data = sharedService.data;
        TaskService.query({ listId: $scope.data.list._id },
            function (tasks) { //success
                if (tasks.length > 0) { $scope.tasksPresent = true; }
                for (idx in tasks) {
                    if (tasks[idx].done) { $scope.doneTasksPresent = true; }
                }
                $scope.data.Tasks = tasks;
            },
            function (err) { //error
            }
        );
    }

    $scope.actionTask = function () {
        if ($scope.buttonText == 'Create')
            createTask();
        else
            updateTask();
        $scope.toFocus = false;
    };
    
    function createTask() {
        $scope.isCollapsed = true;
        $scope.newTask.listId = $scope.data.list._id;
        checkForUrlInTaskDescription($scope.newTask);
        var newTask = new TaskService($scope.newTask);
        newTask.$save(
            function (task) { //success
                if (!task)
                    $log.log('Impossible to create new task entry');
                else {
                    $scope.tasksPresent = true;
                    $scope.data.Tasks.push(task);
                    $scope.newTask = {};
                }
            },
            function (err) { //error
            });
    };
    
    function updateTask() {
        $scope.isCollapsed = true;
        checkForUrlInTaskDescription($scope.newTask);
        $scope.newTask.$save({Id: $scope.newTask._id}, 
            function (task) { //success
                if (!task)
                    $log.log('Impossible to update task entry');
            },
            function (err) { //error
            });
    };

    $scope.removeTask = function (task) {
        var id = task._id;
        TaskService.delete({ Id: id }, 
            function (task) { //success
                for (idx in $scope.data.Tasks) {
                    if ($scope.data.Tasks[idx]._id == id) {
                        $scope.data.Tasks.splice(idx, 1);
                    }
                }
            },
            function (err) { //error
            });
    };

    $scope.editTask = function (task, e) {
        if (e) {
            e.preventDefault(); //pour empecher que le content soit développé
            e.stopPropagation();
        }
        $scope.newTask = task;
        $scope.buttonText = 'Update';
        $scope.isCollapsed = false;
    };

    $scope.showNewTaskPanel = function () {
        $scope.newTask = {};
        $scope.newTask.importance = 1;
        $scope.buttonText = 'Create';
        $scope.isCollapsed = false;
        $scope.toFocus = true;
    };
       
    /**************
     *** Common ***
     **************/

    $scope.action = function () {
        if ($scope.buttonText == 'Create')
            createList();
        else
            updateList();
        $scope.toFocus = false;
    };
    
    $scope.cancel = function () {
        $scope.isCollapsed = true;
        $scope.toFocus = false;
    };

    $scope.chgState = function (item) {
        item.done = !item.done;
        var task = new TaskService(item); //need an instance of the service. $scope.newTask is not such an instance.
        task.$save({Id: task._id},
            function (task) { //success
                if (!task)
                    $log.log('Impossible to update todoList entry');
            },
            function (err) { //error
                $log.log("Hmmm");
            });
    };
}