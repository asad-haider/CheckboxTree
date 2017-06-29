(function () {
    var app, list;

    list = [
        {
            name: 'Developer',
            opened: true,
            accessTypeId: 1,
            children: [
                {
                    name: 'Front-End',
                    accessTypeId: 1,
                    children: [
                        {
                            name: 'Jack',
                            accessTypeId: 1,
                        }, {
                            name: 'John',
                            accessTypeId: 1,
                        }, {
                            name: 'Jason',
                            accessTypeId: 1,
                        }
                    ]
                }, {
                    name: 'Back-End',
                    accessTypeId: 1,
                    children: [
                        {
                            name: 'Mary',
                            accessTypeId: 1,
                            children: [
                                {
                                    name: 'Mary 1',
                                    accessTypeId: 2,
                                }, {
                                    name: 'Gary 1',
                                    accessTypeId: 1,
                                }
                            ]
                        }, {
                            name: 'Gary',
                            accessTypeId: 2,
                            children: [
                                {
                                    name: 'Mary 2',
                                    accessTypeId: 2,
                                }, {
                                    name: 'Gary 2',
                                    accessTypeId: 1,
                                }
                            ]
                        }
                    ]
                }
            ]
        }, {
            name: 'Design',
            accessTypeId: 1,
            children: [
                {
                    name: 'Freeman',
                    accessTypeId: 1,
                }
            ]
        }, {
            name: 'S&S',
            accessTypeId: 1,
            children: [
                {
                    name: 'Nikky',
                    accessTypeId: 1,
                }
            ]
        }
    ];

    app = angular.module('testApp', []).controller('treeTable', [
        '$scope', '$filter', function ($scope, $filter) {
            $scope.list = list;
            $scope.accessTypes = [
                {
                    accessTypeId: 1,
                    title: 'Read'
                },
                {
                    accessTypeId: 2,
                    title: 'Write'
                },
            ];
            $scope.toggleAllCheckboxes = function ($event) {
                var i, item, len, ref, results, selected;
                selected = $event.target.checked;
                ref = $scope.list;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    item = ref[i];
                    item.selected = selected;
                    if (item.children != null) {
                        results.push($scope.$broadcast('changeChildren', item));
                    } else {
                        results.push(void 0);
                    }
                }
                return results;
            };
            $scope.initCheckbox = function (item, parentItem) {
                return item.selected = parentItem && parentItem.selected || item.selected || false;
            };
            $scope.toggleCheckbox = function (item, parentScope) {
                if (item.children != null) {
                    $scope.$broadcast('changeChildren', item);
                }
                if (parentScope.item != null) {
                    return $scope.$emit('changeParent', parentScope);
                }
            };
            $scope.$on('changeChildren', function (event, parentItem) {
                var child, i, len, ref, results;
                ref = parentItem.children;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    child = ref[i];
                    child.selected = parentItem.selected;
                    child.accessTypeId = parentItem.accessTypeId;
                    if (child.children != null) {
                        results.push($scope.$broadcast('changeChildren', child));
                    } else {
                        results.push(void 0);
                    }
                }
                return results;
            });
            return $scope.$on('changeParent', function (event, parentScope) {
                var children;
                children = parentScope.item.children;
                parentScope.item.selected = $filter('selected')(children).length === children.length;
                parentScope.item.isIndeterminate = !parentScope.item.selected;
                if ($filter('selected')(children).length == 0)
                    parentScope.item.isIndeterminate = false;
                parentScope = parentScope.$parent.$parent;
                if (parentScope.item != null) {
                    return $scope.$broadcast('changeParent', parentScope);
                }
            });
        }
    ]);

    app.filter('selected', [
        '$filter', function ($filter) {
            return function (files) {
                return $filter('filter')(files, {
                    selected: true
                });
            };
        }
    ]);

    app.directive('indeterminate', function () {
        return {
            // Restrict the directive so it can only be used as an attribute
            restrict: 'A',

            link(scope, elem, attr) {
                // Whenever the bound value of the attribute changes we update
                // the internal 'indeterminate' flag on the attached dom element
                var watcher = scope.$watch(attr.indeterminate, function (value) {
                    elem[0].indeterminate = value;
                });

                // Remove the watcher when the directive is destroyed
                scope.$on('$destroy', function () {
                    watcher();
                });
            }
        };
    });

}).call(this);