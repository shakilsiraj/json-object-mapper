import 'reflect-metadata';
import {JsonProperty} from '../main/DecoratorMetadata';
import {ObjectMapper} from '../main/index';

describe('Defects', () => {

    it('Defect 22', () => {

        class TestObject {

            @JsonProperty('_eventId')
            private _eventId: number;

            @JsonProperty('_version')
            private _version: number;

            @JsonProperty('_resubmissionAfterDaysSelected')
            private _resubmissionAfterDaysSelected: number | null;

            @JsonProperty({name: '_resubmissionAfterMessagesSelected'})
            private _resubmissionAfterMessagesSelected: number | null;

            get eventId(): number {
                return this._eventId;
            }

            set eventId(value: number) {
                this._eventId = value;
            }

            get version(): number {
                return this._version;
            }

            set version(value: number) {
                this._version = value;
            }

            get resubmissionAfterDaysSelected(): number | any {
                return this._resubmissionAfterDaysSelected;
            }

            set resubmissionAfterDaysSelected(value: number | any) {
                this._resubmissionAfterDaysSelected = value;
            }

            get resubmissionAfterMessagesSelected(): number | any {
                return this._resubmissionAfterMessagesSelected;
            }

            set resubmissionAfterMessagesSelected(value: number | any) {
                this._resubmissionAfterMessagesSelected = value;
            }

        }

        const instance: TestObject = new TestObject();
        instance.eventId = 2416;
        instance.version = 2;
        instance.resubmissionAfterDaysSelected = null;
        instance.resubmissionAfterMessagesSelected = null;

        let serialized: String = ObjectMapper.serialize(instance);
        expect(serialized).toBe('{"_eventId":2416,"_version":2,"_resubmissionAfterDaysSelected":null,"_resubmissionAfterMessagesSelected":null}');

        instance.resubmissionAfterDaysSelected = 3;
        serialized = ObjectMapper.serialize(instance);
        expect(serialized).toBe('{"_eventId":2416,"_version":2,"_resubmissionAfterDaysSelected":3,"_resubmissionAfterMessagesSelected":null}');

    });
});
