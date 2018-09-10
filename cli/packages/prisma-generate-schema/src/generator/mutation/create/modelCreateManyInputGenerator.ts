import { ModelObjectTypeGenerator, RelatedGeneratorArgs, RelatedModelInputObjectTypeGenerator, ModelInputObjectTypeGenerator, TypeFromModelGenerator } from '../../generator'
import { IGQLType, IGQLField } from '../../../datamodel/model'
import { GraphQLObjectType, GraphQLInputFieldConfigMap, GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLInputObjectType, GraphQLString } from "graphql/type"

export abstract class ModelCreateOneOrManyInputGenerator extends ModelInputObjectTypeGenerator {

  protected wouldBeEmptyInternal(model: IGQLType, args: {}) {
    return this.generators.modelWhereUniqueInput.wouldBeEmpty(model, {}) &&
           this.generators.modelCreateInput.wouldBeEmpty(model, {})
  }

  protected abstract maybeWrapList(input: GraphQLInputObjectType): GraphQLInputObjectType

  protected generateFields(model: IGQLType, args: {}) {
    const fields = {} as GraphQLInputFieldConfigMap

    if (!this.generators.modelCreateInput.wouldBeEmpty(model, {})) {
      fields.create = { type: this.maybeWrapList(this.generators.modelCreateInput.generate(model, {})) }
    }

    if (!this.generators.modelWhereUniqueInput.wouldBeEmpty(model, {})) {
      fields.connect = { type: this.maybeWrapList(this.generators.modelWhereUniqueInput.generate(model, {})) }
    }

    return fields
  }
}

// tslint:disable-next-line:max-classes-per-file
export default class ModelCreateManyInputGenerator extends ModelCreateOneOrManyInputGenerator {
  public getTypeName(input: IGQLType, args: RelatedGeneratorArgs) {
    return `${input.name}CreateManyInput`
  }

  protected maybeWrapList(input: GraphQLInputObjectType) {
    return this.generators.scalarTypeGenerator.wrapList(input)
  }
}