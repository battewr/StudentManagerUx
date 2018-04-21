import { assert } from 'chai';

import { EmailInput } from "../src/shared/Components/EmailInput";

const mockEmailFactory = (email: string) => {
    return new EmailInput({email} as any);
}

describe("EmailInput.tsx || IsValidEmail ||", () => {
    it("should gracefully handle null input", () => {
        const emailInputs: any = mockEmailFactory(undefined);

        assert.isFalse(emailInputs.isValidEmail());
    });

    it("should handle strings devoid of symbols", () => {
        const emailInputs: any = mockEmailFactory("hello");

        assert.isFalse(emailInputs.isValidEmail());
    });

    it("should handle spaces", () => {
        const emailInputs: any = mockEmailFactory("he ll o@it.co");

        assert.isFalse(emailInputs.isValidEmail());
    });

    it("should handle missing at symbol", () => {
        const emailInputs: any = mockEmailFactory("hello.co");

        assert.isFalse(emailInputs.isValidEmail());
    });

    it("should handle missing dot symbol", () => {
        const emailInputs: any = mockEmailFactory("hello@co");

        assert.isFalse(emailInputs.isValidEmail());
    });

    it("should handle unicode", () => {
        const emailInputs: any = mockEmailFactory("喜喜@xbox.com");

        assert.isTrue(emailInputs.isValidEmail());
    });

    it("should handle sunny day", () => {
        const emailInputs: any = mockEmailFactory("bradbax@xbox.com");

        assert.isTrue(emailInputs.isValidEmail());
    });
});