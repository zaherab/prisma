import { ModelObjectTypeGenerator, RelatedGeneratorArgs, IGenerators, RelatedModelInputObjectTypeGenerator } from '../../generator'
import { IGQLType, IGQLField } from '../../../datamodel/model'
import { GraphQLObjectType, GraphQLInputFieldConfigMap, GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLInputObjectType, GraphQLString } from "graphql/type"


export default class ModelUpdateWithWhereUniqueNestedInput extends RelatedModelInputObjectTypeGenerator {
  public getTypeName(input: IGQLType, args: RelatedGeneratorArgs) {
    return `${input.name}UpdateWithWhereUniqueNestedInput`
  }

  protected wouldBeEmptyInternal(model: IGQLType, args: RelatedGeneratorArgs) {
    return this.generators.modelWhereUniqueInput.wouldBeEmpty(model, args) &&
           this.generators.modelUpdateDataInput.wouldBeEmpty(model, args)
  }

  protected generateFields(model: IGQLType, args: RelatedGeneratorArgs) {
    const fields = {} as GraphQLInputFieldConfigMap

    if(!this.generators.modelWhereUniqueInput.wouldBeEmpty(model, args)) {
      fields.where = { type: new GraphQLNonNull(this.generators.modelWhereUniqueInput.generate(model, {})) }
    }

    if(!this.generators.modelUpdateDataInput.wouldBeEmpty(model, args)) {
      fields.data = { type: new GraphQLNonNull(this.generators.modelUpdateDataInput.generate(model, {})) }
    }

    return fields
  }
}