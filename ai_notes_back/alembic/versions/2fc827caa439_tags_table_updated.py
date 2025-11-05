"""tags table updated

Revision ID: 2fc827caa439
Revises: 
Create Date: 2025-11-05 09:28:44.966992

"""
from typing import Sequence, Union
from datetime import timezone,datetime
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2fc827caa439'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('tags',sa.Column('is_global',sa.Boolean(),default=False))
    op.add_column('tags',sa.Column('is_created',sa.DateTime(),default=lambda:datetime.now(timezone.utc)))


def downgrade() -> None:
    """Downgrade schema."""
    pass
