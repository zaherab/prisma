package com.prisma.deploy.specutils

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import com.prisma.auth.AuthImpl
import com.prisma.deploy.DeployDependencies
import com.prisma.deploy.connector.DeployConnector
import com.prisma.deploy.migration.validation.SchemaError
import com.prisma.deploy.schema.mutations.{FunctionInput, FunctionValidator}
import com.prisma.deploy.server.auth.DummyClusterAuth
import com.prisma.errors.{BugsnagErrorReporter, ErrorReporter}
import com.prisma.messagebus.pubsub.inmemory.InMemoryAkkaPubSub
import com.prisma.shared.models.Project

case class DeployTestDependencies(deployConnector: DeployConnector)(implicit val system: ActorSystem, val materializer: ActorMaterializer)
    extends DeployDependencies {

  override implicit def self: DeployDependencies = this

  implicit val reporter: ErrorReporter    = BugsnagErrorReporter(sys.env.getOrElse("BUGSNAG_API_KEY", ""))
  override lazy val migrator              = TestMigrator(migrationPersistence, deployPersistencePlugin.deployMutactionExecutor)
  override lazy val clusterAuth           = DummyClusterAuth()
  override lazy val invalidationPublisher = InMemoryAkkaPubSub[String]()

  override def apiAuth = AuthImpl

  override def functionValidator: FunctionValidator = (project: Project, fn: FunctionInput) => {
    if (fn.name == "failing") Vector(SchemaError(`type` = "model", field = "field", description = "error")) else Vector.empty
  }

  override def deployPersistencePlugin = deployConnector
}
