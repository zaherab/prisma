import { ModelObjectTypeGenerator, RelatedGeneratorArgs, IGenerators, RelatedModelInputObjectTypeGenerator } from '../../generator'
import { IGQLType, IGQLField } from '../../../datamodel/model'
import { GraphQLObjectType, GraphQLInputFieldConfigMap, GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLInputObjectType, GraphQLString } from "graphql/type"
import { capitalize, plural } from '../../../util/util';


export default class ModelUpdateWithWhereUniqueWithoutRelatedInput extends RelatedModelInputObjectTypeGenerator {
  public getTypeName(input: IGQLType, args: RelatedGeneratorArgs) {
    const field = args.relatedField.relatedField as IGQLField
    return `${input.name}UpdateWithWhereUniqueWithout${capitalize(field.name)}Input`
  }

  protected wouldBeEmptyInternaly(model: IGQLType, args: RelatedGeneratorArgs) {
    return this.generators.modelWhereUniqueInput.wouldBeEmpty(model, args) &&
           this.generators.modelUpdateWithoutRelatedDataInput.wouldBeEmpty(model, args)
  }

  protected generateFields(model: IGQLType, args: RelatedGeneratorArgs) {
    const fields = {} as GraphQLInputFieldConfigMap

    if(!this.generators.modelWhereUniqueInput.wouldBeEmpty(model, args)) {
      fields.where = { type: new GraphQLNonNull(this.generators.modelWhereUniqueInput.generate(model, args)) }
    }
    if(!this.generators.modelUpdateWithoutRelatedDataInput.wouldBeEmpty(model, args)) {
      fields.data = { type: new GraphQLNonNull(this.generators.modelUpdateWithoutRelatedDataInput.generate(model, args)) }
    }

    return fields
  }
}