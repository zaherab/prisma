package com.prisma.deploy.connector.postgresql

import com.prisma.config.ConfigLoader
import com.prisma.deploy.migration.migrator.MigrationApplierSpec
import com.prisma.deploy.schema.mutations._
import com.prisma.deploy.schema.queries._
import com.prisma.deploy.specutils.{DeploySpecBase, DeployTestDependencies}
import org.scalatest.Suite

trait PostgresDeploySpecBase extends DeploySpecBase { self: Suite =>
  import system.dispatcher

  override implicit lazy val testDependencies: DeployTestDependencies = DeployTestDependencies(PostgresDeployConnector(ConfigLoader.load().databases.head))
}

// package: schema.mutations
class AddProjectMutationSpecPostgres                extends AddProjectMutationSpec with PostgresDeploySpecBase
class DeleteServiceMutationSpecPostgres             extends DeleteServiceMutationSpec with PostgresDeploySpecBase
class DeployMutationRegressionSpecPostgres          extends DeployMutationRegressionSpec with PostgresDeploySpecBase
class DeployMutationSpecPostgres                    extends DeployMutationSpec with PostgresDeploySpecBase
class SeveralRelationsBetweenSameModelsSpecPostgres extends SeveralRelationsBetweenSameModelsSpec with PostgresDeploySpecBase

// package: schema.queries
class ClusterInfoSpecPostgres          extends ClusterInfoSpec with PostgresDeploySpecBase
class GenerateProjectTokenSpecPostgres extends GenerateProjectTokenSpec with PostgresDeploySpecBase
class ListMigrationsSpecPostgres       extends ListMigrationsSpec with PostgresDeploySpecBase
class ListProjectsSpecPostgres         extends ListProjectsSpec with PostgresDeploySpecBase
class MigrationStatusSpecPostgres      extends MigrationStatusSpec with PostgresDeploySpecBase
class ProjectSpecPostgres              extends ProjectSpec with PostgresDeploySpecBase

// package: migration.migrator
class MigrationApplierSpecPostgres extends MigrationApplierSpec with PostgresDeploySpecBase
