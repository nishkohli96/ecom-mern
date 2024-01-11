https://earthly.dev/blog/build-monorepo-with-turporepo/

- The `dependsOn` key tells Turborepo which tasks should be finished before this task can run. The caret symbol (ie ^) denotes that a workspace’s build task depends on the buildtask of its dependencies and devDependencies being completed first. The outputs key tells Turborepo which directories to cache. Note: output globs are relative to each package's `package.json`, and not the monorepo root.

- The test task depends on the build task being finished. Note that the caret is absent this time, which means the build task of the whole workspace is being referred to. This means whenever test is executed, build is also executed in the workspace, which, in turn, executes the build task in each dependency.

- The inputs key tells TurboRepo that the tests should be rerun whenever the specified files are modified. The test task is loaded from the cache if none of the specified files are modified.

- lint Task
  The lint task should run linters on the packages. This task has no dependencies and should be able to run whenever needed. So you need to use an empty object.

- dev Task
  The dev task starts development builds in each package. Since this should never be cached, you must set cache: false. Additionally, since the development servers are persistent, meaning they never exit on their own, you need to set persistent: true. This makes sure no other task can depend on the dev task.
