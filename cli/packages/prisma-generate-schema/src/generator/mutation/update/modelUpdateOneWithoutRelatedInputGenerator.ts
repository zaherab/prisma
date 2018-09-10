import { ModelObjectTypeGenerator, RelatedGeneratorArgs, RelatedModelInputObjectTypeGenerator, TypeFromModelGenerator } from '../../generator'
import { IGQLType, IGQLField } from '../../../datamodel/model'
import { GraphQLObjectType, GraphQLInputFieldConfigMap, GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLInputObjectType, GraphQLString } from "graphql/type"
import { plural, capitalize } from '../../../util/util';


export default class ModelUpdateOneWithoutRelatedInputTypeGenerator extends RelatedModelInputObjectTypeGenerator {
  public getTypeName(input: IGQLType, args: RelatedGeneratorArgs) {
    const field = (args.relatedField.relatedField as IGQLField)
    return `${input.name}UpdateOneWithout${capitalize(field.name)}Input`
  }

  protected generateFields(model: IGQLType, args: RelatedGeneratorArgs) {
    const fields = {} as GraphQLInputFieldConfigMap

    if (!this.generators.modelCreateWithoutRelatedInput.wouldBeEmpty(model, args)) {
      fields.create = { type: this.generators.modelCreateWithoutRelatedInput.generate(model, args) }
    }
    if (!this.generators.modelUpdateWithoutRelatedDataInput.wouldBeEmpty(model, args)) {
      fields.update = { type: this.generators.modelUpdateWithoutRelatedDataInput.generate(model, args) }
    }
    if (!this.generators.modelUpsertWithoutRelatedInput.wouldBeEmpty(model, args)) {
      fields.upsert = { type: this.generators.modelUpsertWithoutRelatedInput.generate(model, args) }
    }

    fields.delete = { type: this.generators.scalarTypeGenerator.generate('Boolean', {}) }

    if (!args.relatedField.isRequired || args.relatedField.isList) {
      fields.disconnect = { type: this.generators.scalarTypeGenerator.generate('Boolean', {}) }
    }

    if (!this.generators.modelWhereUniqueInput.wouldBeEmpty(model, args)) {
      fields.connect = { type: this.generators.modelWhereUniqueInput.generate(model, args) }
    }
    return fields
  }
}