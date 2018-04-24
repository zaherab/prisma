package com.prisma.deploy.connector.mysql

import com.prisma.config.ConfigLoader
import com.prisma.deploy.migration.migrator.MigrationApplierSpec
import com.prisma.deploy.schema.mutations._
import com.prisma.deploy.schema.queries._
import com.prisma.deploy.specutils.{DeploySpecBase, DeployTestDependencies}
import org.scalatest.Suite

trait MySqlDeploySpecBase extends DeploySpecBase { self: Suite =>
  import system.dispatcher

  override implicit lazy val testDependencies: DeployTestDependencies = DeployTestDependencies(MySqlDeployConnector(ConfigLoader.load().databases.head))
}

// package: schema.mutations
class AddProjectMutationSpecMySql                extends AddProjectMutationSpec with MySqlDeploySpecBase
class DeleteServiceMutationSpecMySql             extends DeleteServiceMutationSpec with MySqlDeploySpecBase
class DeployMutationRegressionSpecMySql          extends DeployMutationRegressionSpec with MySqlDeploySpecBase
class DeployMutationSpecMySql                    extends DeployMutationSpec with MySqlDeploySpecBase
class SeveralRelationsBetweenSameModelsSpecMySql extends SeveralRelationsBetweenSameModelsSpec with MySqlDeploySpecBase

// package: schema.queries
class ClusterInfoSpecMySql          extends ClusterInfoSpec with MySqlDeploySpecBase
class GenerateProjectTokenSpecMySql extends GenerateProjectTokenSpec with MySqlDeploySpecBase
class ListMigrationsSpecMySql       extends ListMigrationsSpec with MySqlDeploySpecBase
class ListProjectsSpecMySql         extends ListProjectsSpec with MySqlDeploySpecBase
class MigrationStatusSpecMySql      extends MigrationStatusSpec with MySqlDeploySpecBase
class ProjectSpecMySql              extends ProjectSpec with MySqlDeploySpecBase

// package: migration.migrator
class MigrationApplierSpecMySql extends MigrationApplierSpec with MySqlDeploySpecBase
